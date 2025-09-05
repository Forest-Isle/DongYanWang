import subprocess
import os
import time

def start_elasticsearch():
    es_bin_path = r"D:\Microsoft Edge\software\elasticsearch-9.1.2-windows-x86_64\elasticsearch-9.1.2\bin\elasticsearch.bat"

    # 确保路径存在
    if not os.path.exists(es_bin_path):
        raise FileNotFoundError(f"找不到文件: {es_bin_path}")

    # 启动 ES（新开终端窗口运行，不阻塞 Python）
    process = subprocess.Popen(
        ["cmd.exe", "/k", es_bin_path],
        creationflags=subprocess.CREATE_NEW_CONSOLE
    )

    # 等待几秒钟给 ES 启动时间
    print("正在启动 Elasticsearch，请稍等 10 秒...")
    time.sleep(10)

    return process

es_process = start_elasticsearch()