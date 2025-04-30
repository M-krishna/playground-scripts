#!/usr/bin/env python3
import psutil
import time
import os
from datetime import datetime


def find_server_process():
    for proc in psutil.process_iter(['pid', 'name', 'cmdline']):
        try:
            if 'simple_web_server.py' in ' '.join(proc.info['cmdline'] or []):
                return proc
        except (psutil.NoSuchProcess, psutil.AccessDenied):
            pass
    return None


def monitor_server():
    while True:
        process = find_server_process()
        if not process:
            print("Server process not found!")
            break

        try:
            cpu = process.cpu_percent()
            memory = process.memory_info().rss / 1024 / 1024 # convert to MB
            connections = len(process.net_connections())

            timestamp = datetime.now().strftime("%H:%M:%S")
            print(f"[{timestamp}] CPU: {cpu}% | Memory: {memory: .2f}MB | Connections: {connections}")
            time.sleep(1)
        except (psutil.NoSuchProcess, psutil.AccessDenied):
            print("Lost connection to server process")
            break


if __name__ == "__main__":
    print("Starting server monitoring...")
    monitor_server()