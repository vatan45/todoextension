
chrome.storage.sync.get('todoistToken', function (data) {
    if (data.todoistToken) {
        const todoistToken = data.todoistToken;


        const button = document.createElement('button');
        button.textContent = 'Add to Todoist';
        button.style.position = 'fixed';
        button.style.top = '10px';
        button.style.right = '10px';
        button.style.zIndex = '1000';
        button.onclick = function () {
            addVideoToTodoist(todoistToken);
        };

        document.body.appendChild(button);
    } else {
        console.error('Todoist API token not found.');
    }
});

function addVideoToTodoist(todoistToken) {
    const videoUrl = window.location.href;
    const videoTitle = document.title;

    fetch('https://api.todoist.com/rest/v2/tasks', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${todoistToken}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            content: `Watch video: ${videoTitle}`,
            description: videoUrl
        })
    })
        .then(response => response.json())
        .then(data => {
            alert('Video added to your Todoist!');
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Failed to add video to Todoist.');
        });
}
