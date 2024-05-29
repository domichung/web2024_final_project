document.addEventListener('DOMContentLoaded', () => {
    const scoreElement = document.getElementById('score');
    const button = document.getElementById('button');
    const buttonScoreSpan = document.getElementById('buttonScore');
    const username = localStorage.getItem('username');

    const items = [
        { src: 'item01.jpg', scoreChange: 1, probability: 70 },
        { src: 'item02.jpg', scoreChange: 3, probability: 20 },
        { src: 'item03.jpg', scoreChange: 5, probability: 8 },
        { src: 'item04.jpg', scoreChange: 10, probability: 1 },
        { src: 'item05.jpg', scoreChange: 100, probability: 0.99 },
        { src: 'item06.jpg', scoreChange: (score) => score * 2, probability: 0.01 }
    ];

    async function fetchScore() {
        const response = await fetch('/get-score', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username })
        });

        const result = await response.json();
        if (result.success) {
            return result.score;
        } else {
            console.error('Failed to fetch score:', result.message);
            return 0;
        }
    }

    fetchScore().then((initialScore) => {
        let score = initialScore;
        scoreElement.textContent = `Score: ${score}`;

        const screenWidth = window.innerWidth;
        const screenHeight = window.innerHeight;

        button.addEventListener('click', async () => {
            if (!button.disabled) {
                await handleClick();
            }
        });

        setInterval(async () => {
            if (!button.disabled) {
                button.disabled = true;
                await fadeOut(button);
                moveButtonRandomly();
                await fadeIn(button);
                button.disabled = false;
            }
        }, 2000);

        async function handleClick() {
            const item = getRandomItem();
            const scoreChange = typeof item.scoreChange === 'function' ? item.scoreChange(score) : item.scoreChange;
            score += scoreChange;
            scoreElement.textContent = `Score: ${score}`;
            await updateScoreOnServer(username, score);
            button.disabled = true;
            await fadeOut(button);
            moveButtonRandomly();
            await fadeIn(button);
            button.disabled = false;
        }

        function moveButtonRandomly() {
            const item = getRandomItem();
            const scoreChange = typeof item.scoreChange === 'function' ? item.scoreChange(score) : item.scoreChange;
            button.style.backgroundImage = `url('/img/${item.src}')`;
            buttonScoreSpan.textContent = scoreChange;
            buttonScoreSpan.style.display = 'block';

            let targetX = Math.random() * (screenWidth - button.offsetWidth);
            let targetY = Math.random() * (screenHeight - button.offsetHeight);

            targetX = Math.max(0, Math.min(screenWidth - button.offsetWidth, targetX));
            targetY = Math.max(0, Math.min(screenHeight - button.offsetHeight, targetY));

            button.style.left = `${targetX}px`;
            button.style.top = `${targetY}px`;
        }

        moveButtonRandomly();
    });

    async function updateScoreOnServer(username, score) {
        const response = await fetch('/update-score', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, score })
        });

        const result = await response.json();
        if (!result.success) {
            console.error('Failed to update score:', result.message);
        }
    }

    function getRandomItem() {
        const rand = Math.random() * 100;
        let cumulativeProbability = 0;

        for (const item of items) {
            cumulativeProbability += item.probability;
            if (rand <= cumulativeProbability) {
                return item;
            }
        }
        return items[0];
    }

    function fadeIn(element) {
        return new Promise((resolve) => {
            element.style.opacity = 0;
            element.style.transition = 'opacity 0.5s';
            element.style.opacity = 1;
            setTimeout(resolve, 500);
        });
    }

    function fadeOut(element) {
        return new Promise((resolve) => {
            element.style.opacity = 1;
            element.style.transition = 'opacity 0.5s';
            element.style.opacity = 0;
            setTimeout(resolve, 500);
        });
    }
});
