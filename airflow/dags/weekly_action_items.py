from datetime import datetime,date
from airflow.providers.mongo.hooks.mongo import MongoHook
from airflow.providers.http.hooks.http import HttpHook
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

            print(output)

            return output
        except Exception as e:
            print(f"Error connecting to MongoDB: {repr(e)}")
            raise e

    
    @task.python(retries=5)
    def generate_action_items(current_client):
        try:
            hook = HttpHook(http_conn_id='action_items_service')
            connection = hook.get_conn()
            connection.post(hook.url_from_endpoint('/generate'), data=json.dumps(current_client))
            print(f"Created action items for client: {current_client['email']}")
        except Exception as e:
            print(f"Error creating action items for client: {current_client['email']} Exception: {repr(e)}")
            raise e


    clients = get_clients()
    generate_action_items.expand(current_client=clients)

weekly_action_items_dag = weekly_action_items()