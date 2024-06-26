from datetime import datetime,date
from airflow.providers.mongo.hooks.mongo import MongoHook
from airflow.providers.apache.kafka.operators.produce import ProduceToTopicOperator
from airflow.decorators import dag, task
from bson import json_util
import json

@dag(schedule_interval='@daily', start_date=datetime(2024, 1, 1), catchup=False)
def weekly_action_items():

    @task.python(retries=5)
    def get_clients():
        import calendar

        try:
            hook = MongoHook(mongo_conn_id='metadata')
            connection = hook.get_conn()
            clients_collection = connection.metadata.clients

            print(f"Connected to MongoDB - {connection.server_info()}")
            today = calendar.day_name[date.today().weekday()] 
            result = list(clients_collection.find({"actionsRefreshWeekday": today}))
            output = json.loads(json_util.dumps(result))

            for client in output:
                client["_id"] = client["_id"]["$oid"]

            return json.dumps(output)
        except Exception as e:
            print(f"Error connecting to MongoDB: {repr(e)}")
            raise e

    
    def produce_action_items_requests(clients):
        request_date = datetime.today().strftime("%Y-%m-%d")
        clients_list = json.loads(clients)

        for client in clients_list:
            key = f'{request_date}-{client["businessId"]}'
            yield (
                json.dumps(key), 
                json.dumps(
                    {
                        "businessId": client["businessId"], 
                        "date": request_date
                    }
                ),
            )

    produce_weekly_action_items = ProduceToTopicOperator(
        task_id="produce_weekly_action_items_requests",
        kafka_config_id="kafka_default",
        topic="weekly_action_items_requests",
        producer_function=produce_action_items_requests,
        producer_function_args=["{{ ti.xcom_pull(task_ids='get_clients')}}"],
        poll_timeout=10,
        retries=5
    )

    get_clients() >> produce_weekly_action_items

weekly_action_items_dag = weekly_action_items()