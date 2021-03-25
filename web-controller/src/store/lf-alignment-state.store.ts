// ==== Library Imports =======================================================
import { createStore } from '@stencil/store';
import { LfDeviceScanType, LfObjectDetails } from '../shared/interfaces/lf-web-controller.interface';
import { LfObjectAnalysis } from '../shared/models/lf-object-analysis.model';

// ==== App Imports ===========================================================
import LfLoggerService from '../shared/services/lf-logger.service';
import lfRemoteApiAlignmentService from '../shared/services/lf-remote-api/lf-remote-api-alignment.service';

const MOCK_ANALYSIS: LfObjectAnalysis = {
  detectionBounds: [
    [314, 369],
    [314, 664],
    [517, 664],
    [517, 369]
  ],
  alignmentCorners: [
    [505, 656],
    [320, 634],
    [320, 377],
    [502, 417]
  ],
  // objectId: 'a2c5eb8b-638a-4eb4-8251-d1b82a0a8e19', // pacha
  objectId: 'a9a19d46-aa4c-46e3-86b8-aeb6c0dc7a89',
  applyResponse: null,
}


// const MOCK_OBJECT_NAME = "Griegher Rivver";
const MOCK_OBJECT_NAME = "Wall space";
const MOCK_IMG_URL = "/assets/images/query-image.jpg";

interface LfAlignmentState {
  scanType: LfDeviceScanType;
  objectAnalysis: LfObjectAnalysis,
  environmentAnalysis: any, // TODO
  scanImageUrl: string,
  lfObjectOutlineImgUrl: string,
  lfObjectName: string,
  lfObjectId: string,
  registeredObjects: Array<LfObjectDetails>,
  selectedLfAlignmentObject: LfObjectDetails,
}

// Own Properties
// --------------------------------------------------------
const log = new LfLoggerService('LfAlignmentState').logger;

// App State Initialization
// --------------------------------------------------------
const { state, onChange } = createStore({
  scanType: null,
  objectAnalysis: null,
  environmentAnalysis: null, // TODO
  scanImageUrl: null,
  lfObjectOutlineImgUrl: null,
  lfObjectName: null,
  lfObjectId: null,
  registeredObjects: null,
  selectedLfAlignmentObject: null,
} as LfAlignmentState);


// TESTING DATA
// const { state, onChange } = createStore({
//   scanType: 'object',
//   objectAnalysis: MOCK_ANALYSIS,
//   environmentAnalysis: null, // TODO
//   scanImageUrl: MOCK_IMG_URL,
//   lfObjectOutlineImgUrl: null,
//   lfObjectName: MOCK_OBJECT_NAME,
//   lfObjectId: null,
//   registeredObjects: null,
//   selectedLfAlignmentObject: null,
// } as LfAlignmentState);



// onStateChange Watchers
// --------------------------------------------------------

onChange('scanImageUrl', scanImageUrl => {
  log.info("onChange 'scanImageUrl'", scanImageUrl);
  const event = new CustomEvent('_scanImageUrlUpdated', { detail: scanImageUrl });
  document.dispatchEvent(event);
});

onChange('lfObjectOutlineImgUrl', scanImageUrl => {
  log.info("onChange 'lfObjectOutlineImgUrl'", scanImageUrl);
  const event = new CustomEvent('_lfObjectOutlineImgUrl', { detail: scanImageUrl });
  document.dispatchEvent(event);
});

onChange('selectedLfAlignmentObject', selectedLfAlignmentObject => {
  log.info("onChange 'selectedLfAlignmentObject'", selectedLfAlignmentObject);
  const event = new CustomEvent('_selectedLfAlignmentObjectUpdated', { detail: selectedLfAlignmentObject });
  document.dispatchEvent(event);
});


// Public Methods
// --------------------------------------------------------

export function getObjectNameById(id: string, registeredObjects: Array<LfObjectDetails> = null): string {
  const objectArray = registeredObjects || state.registeredObjects;

  if (!id || !objectArray) {
    return;
  }

  let objectName: string;

  objectArray.forEach((object: LfObjectDetails) => {
    if (object.id === id) {
      objectName = object.name;
      return;
    }
  })
  return objectName;
}

export function getObjectIdByName(objectName: string, registeredObjects: Array<LfObjectDetails> = null): string {
  let objectArray = registeredObjects || state.registeredObjects;

  if (!objectName || !objectArray) {
    return;
  }

  let objectId: string;

  objectArray.forEach((object: LfObjectDetails) => {
    if (object.name.toLowerCase() === objectName.toLowerCase()) {
      objectId = object.id;
      return;
    }
  })

  return objectId;
}

export function resetAlignmentState() {
  state.objectAnalysis = null;
  state.scanImageUrl = null;
  state.lfObjectOutlineImgUrl = null;
  state.lfObjectName = null;
  state.lfObjectId = null
  state.selectedLfAlignmentObject = null;

  const event = new CustomEvent('_resetAlignmentState', { detail: state });
  document.dispatchEvent(event);
}

export default state as LfAlignmentState;


