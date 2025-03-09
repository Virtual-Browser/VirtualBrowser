from playwright.sync_api import sync_playwright
import requests

def main():
    # 通过API启动环境
    try:
        response = requests.post(
            'http://localhost:9000/api/launchBrowser',
            json={'id': 1},
            headers={'Content-Type': 'application/json'}
        ).json()
    except Exception as err:
        print(f"错误: {err}")
        return

    # 返回debuggingPort
    print(response)

    if not response.get('success'):
        return

    # 使用playwright连接浏览器
    with sync_playwright() as p:
        browser = p.chromium.connect_over_cdp(f"http://localhost:{response['data']['debuggingPort']}")
        
        # 使用当前窗口
        context = browser.contexts[0]
        page = context.new_page()

        # 访问应用程序
        page.goto('https://www.baidu.com/')

        page2 = context.new_page()
        page2.goto('https://www.163.com/')

        # 其他测试代码...

        # 关闭浏览器
        # browser.close()  # 调试时可以注释掉此行

if __name__ == "__main__":
    main()
