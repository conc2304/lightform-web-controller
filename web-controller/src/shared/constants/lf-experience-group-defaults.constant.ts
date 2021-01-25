import { LfProjectMetadata } from "../interfaces/lf-web-controller.interface";

export const LF_EXPERIENCE_GROUP_DEFAULT: LfProjectMetadata = {
  name: 'Other Inputs',
  id: null,
  slides: [
    // // TODO - wait for implementation of switching to creator project
    // {
    //   name: 'Creator',
    //   type: 'creator',
    //   index: 0,
    //   projectId: null,
    //   projectName: 'Device',
    // },
    {
      name: 'HDMI 1',
      type: 'hdmi',
      index: 1,
      thumbnail: './assets/icons/HDMI-input.svg',
      projectId: null,
      projectName: 'Device',
    },
    {
      name: 'HDMI 2',
      type: 'hdmi',
      index: 2,
      thumbnail: './assets/icons/HDMI-input.svg',
      projectId: null,
      projectName: 'Device',
    },
  ],
};
