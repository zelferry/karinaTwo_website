const counters = document.querySelectorAll('.counter');
const back_button = document.getElementById("back_button");
back_button.style.display = 'none';

counters.forEach(counter => {
	counter.innerText = '0';
	
	const updateCounter = () => {
		const target = +counter.getAttribute('data-target');
		const c = +counter.innerText;
		
		const increment = target / 1000;
		
		if(c < target) {
			counter.innerText = `${Math.ceil(c + increment)}`;
			setTimeout(updateCounter, 1)
		} else {
			counter.innerText = target;
            counter.classList.toggle("daily_animation");
            back_button.style.display = 'block';
            back_button.classList.toggle("back_animation");
		}
	};
	
	updateCounter();
});