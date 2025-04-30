from locust import HttpUser, task, between

class WebServerUser(HttpUser):
    # wait between 1 to 3 seconds between tasks
    wait_time = between(1, 3)

    @task
    def get_root(self):
        # Test the root endpoint
        with self.client.get("/") as response:
            if response.status_code != 200:
                print(f"Request failed with status code: {response.status_code}")