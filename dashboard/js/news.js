class News extends HTMLElement {
	constructor() {
		super();

		this.attachShadow({ mode: 'open' });

		const wrapper = document.createElement("marquee");
		wrapper.direction = "up";
		wrapper.height = "100%";
		wrapper.scrollAmount = 1;
		const parser = new DOMParser();
		fetch("https://www.nytimes.com/svc/collections/v1/publish/https://www.nytimes.com/section/world/rss.xml")
			.then(newsRssResponse => newsRssResponse.text())
			.then(newsRssText => {
				const rss = parser.parseFromString(newsRssText, "text/xml");
				const stories = rss.querySelectorAll("item");
				stories.forEach(story => {
					const title = story.querySelector("title").textContent;
					const description = story.querySelector("description").textContent;
					const tileElem = document.createElement("b");
					tileElem.innerText = title;
					const descriptionElem = document.createElement("p");
					descriptionElem.innerText = description;
					wrapper.appendChild(tileElem);
					wrapper.appendChild(descriptionElem);
				});

				this.shadowRoot.append(wrapper);
			});
	}
}

customElements.define("x-news", News);