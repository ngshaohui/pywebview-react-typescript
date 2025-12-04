import os
import threading
import webview

from time import sleep, time


class Api:
    def fullscreen(self):
        webview.windows[0].toggle_fullscreen()

    def hello(self, name):
        sleep(1)
        print("Hello from react")
        return f"Hello {name} from python"


def get_entrypoint():
    def exists(path):
        return os.path.exists(os.path.join(os.path.dirname(__file__), path))

    if exists("../gui/index.html"):  # unfrozen development
        return "../gui/index.html"

    if exists("../Resources/gui/index.html"):  # frozen py2app
        return "../Resources/gui/index.html"

    if exists("./gui/index.html"):
        return "./gui/index.html"

    raise Exception("No index.html found")


def set_interval(interval):
    def decorator(function):
        def wrapper(*args, **kwargs):
            stopped = threading.Event()

            def loop():  # executed in another thread
                while not stopped.wait(interval):  # until stopped
                    function(*args, **kwargs)

            t = threading.Thread(target=loop)
            t.daemon = True  # stop if the program exits
            t.start()
            return stopped

        return wrapper

    return decorator


entry = get_entrypoint()


@set_interval(1)
def update_ticker(window: webview.Window):
    window.state.ticker = int(time())


def main():
    window = webview.create_window(
        "pywebview-react-ts boilerplate", entry, js_api=Api()
    )
    if window is None:
        raise Exception("unable to create window")
    window.events.loaded += lambda: update_ticker(window)
    webview.start(debug=True)


if __name__ == "__main__":
    main()
