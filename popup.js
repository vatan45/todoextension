document.addEventListener('DOMContentLoaded', function () {
    // Check if token is already saved
    chrome.storage.sync.get('todoistToken', function (data) {
        if (!data.todoistToken) {
            // If no token is saved, prompt user to enter it
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
                        // After saving, reload the popup with task options
                        setTimeout(() => location.reload(), 2000);
                    });
                } else {
                    showStatus('Please enter a valid token.', 'error');
                }
            });
        } else {
            // Token is saved, show task button
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

// Function to show status messages with effects
function showStatus(message, type) {
    const statusElement = document.getElementById('status');
    statusElement.textContent = message;
    statusElement.className = type; // 'success' or 'error'
    setTimeout(() => {
        statusElement.textContent = '';
        statusElement.className = '';
    }, 3000); // Clear message after 3 seconds
}
