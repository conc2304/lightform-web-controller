const mockSceneList = [
	{
		sceneImgURl: "http://www.fillmurray.com/120/120",
		title: "Pachamama Default",
		description:
			"This is a placeholder text for a one line summary that paints a picture of this video for the user.",
		duration: 1000,
	},

	{
		sceneImgURl: "http://www.fillmurray.com/120/120",
		title: "Deep Mood",
		description:
			"This is a placeholder text for a one line summary that paints a picture of this video for the user.",
		duration: 1000,
	},

	{
		sceneImgURl: "http://www.fillmurray.com/120/120",
		title: "THIS IS A REALLY LONG TITLE TO TEST IT OUT SO HERE WE GO",
		description:
			"LONG - This is a placeholder text for a one line summary that paints a picture of this video for the user. LONG - This is a placeholder text for a one line summary that paints a picture of this video for the user. ",
		duration: 1000,
	},

	{
		sceneImgURl: "http://www.fillmurray.com/120/120",
		title: "Deep Mood",
		description:
			"LONG - This is a placeholder text for a one line summary that paints a picture of this video for the user. LONG - This is a placeholder text for a one line summary that paints a picture of this video for the user. ",
		duration: 1000,
	},
];
const mockExperiences = [
	{
		experienceTitle: "Pachamama",
		scenes: mockSceneList,
	},
	{
		experienceTitle: "Ambience",
		scenes: mockSceneList,
	},
	{
		experienceTitle: "Other Inputs",
		scenes: [
			{
				title: "Creator",
			},
			{
				title: "HDMI 1",
			},
			{
				title: "HDMI 2",
			},
		],
	},
];
