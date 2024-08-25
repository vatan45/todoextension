document.addEventListener('DOMContentLoaded', function () {

    chrome.storage.sync.get('todoistToken', function (data) {
        if (!data.todoistToken) {

            document.body.innerHTML = `
                <h3>Video To-Do List</h3>
                <input type="password" id="todoist-token" placeholder="Enter your Todoist API token" />
                <button id="save-token">Save Token</button>
                <p id="status"></p>
            `;
            document.getElementById('save-token').addEventListener('click', function () {
                const token = document.getElementById('todoist-token').value;
                if (token) {
                    chrome.storage.sync.set({ todoistToken: token }, function () {
                        console.log('Token saved');
                        showStatus('Token saved! You can now add tasks.', 'success');

                        setTimeout(() => location.reload(), 2000);
                    });
                } else {
                    showStatus('Please enter a valid token.', 'error');
                }
            });
        } else {

            document.body.innerHTML = `
                <h3>Video To-Do List</h3>
                <p id="status"></p>
                <button id="add-url-task">Add Task with Current URL</button>
            `;
            document.getElementById('add-url-task').addEventListener('click', function () {
                chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
                    const currentTab = tabs[0];
                    const taskContent = `Complete this video: ${currentTab.url}`;

                    chrome.runtime.sendMessage({
                        action: 'addTodoistTask',
                        taskContent: taskContent
                    }, function (response) {
                        console.log('Response from background script:', response);
                        if (response.success) {
                            showStatus('Video added to your Todoist list!', 'success');
                        } else {
                            showStatus('Error adding task: ' + response.error, 'error');
                        }
                    });
                });
            });
        }
    });
});


function showStatus(message, type) {
    const statusElement = document.getElementById('status');
    statusElement.textContent = message;
    statusElement.className = type;
    setTimeout(() => {
        statusElement.textContent = '';
        statusElement.className = '';
    }, 3000);
}
