chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    if (request.action === 'addTodoistTask') {
        chrome.storage.sync.get('todoistToken', function (data) {
            const token = data.todoistToken;
            if (!token) {
                sendResponse({ success: false, error: 'No Todoist token found.' });
                return;
            }

            fetch('https://api.todoist.com/rest/v2/tasks', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ content: request.taskContent })
            })
                .then(response => response.json())
                .then(data => {
                    console.log('Task added:', data);
                    sendResponse({ success: true });
                })
                .catch(error => {
                    console.error('Error adding task:', error);
                    sendResponse({ success: false, error: error.toString() });
                });
        });


        return true;
    }
});
