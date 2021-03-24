class Forecast extends HTMLElement {
	constructor() {
		super();
		this.attachShadow({ mode: 'open' });
		const wrapper = document.createElement("div");
		wrapper.classList.add("wrapper");

		const style = document.createElement("style");
		style.textContent = `
			.wrapper {
				display: grid;
				grid-template-columns: 50% 50%;
				grid-template-rows: auto;
				grid-template-areas:
					"weather temp"
					"time    time";
				height: 100%;
			}

			.weather {
				grid-area: weather;
				justify-self: center;
				align-self: center;
			}

			.temp {
				grid-area: temp;
				align-self: center;
				font-size: 24px;
			}

			.time {
				grid-area: time;
				justify-self: center;
				align-self: start;
				font-size: 20px;
			}
		`

		this.weatherElem = document.createElement("div");
		this.weatherElem.classList.add("weather");

		this.tempElem = document.createElement("div");
		this.tempElem.classList.add("temp");

		this.timeElem = document.createElement("div");
		this.timeElem.classList.add("time");
	
		wrapper.appendChild(this.weatherElem);
		wrapper.appendChild(this.tempElem);
		wrapper.appendChild(this.timeElem);
		this.shadowRoot.append(style, wrapper);
	}

	update() {
		this.weatherElem.innerHTML = this.getAttribute("weather");
		this.tempElem.innerText = this.getAttribute("temp") + "°";
		this.timeElem.innerText = this.getAttribute("time");
	}

	connectedCallback() {
		this.update();
	}

	attributeChangedCallback(_, __, ___) {
		this.update();
	}

	static get observedAttributes() {
		return ["weather", "temp", "time"];
	}
}

customElements.define("x-forecast", Forecast);