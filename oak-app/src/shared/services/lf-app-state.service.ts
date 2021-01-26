// ==== Library Imports =======================================================

// ==== App Imports ===========================================================
import { WifiEntry } from '../interfaces/wifi-entry.interface';
import { LfPairingFlowViewState as FlowState } from '../enums/lf-pairing-flow-state.enum';
class LfAppStateStore {
  // ==== PUBLIC ============================================================
  // ---- Properties --------------------------------------------------------

  public selectedNetwork: WifiEntry = null;
  public password: string | null = null;
  public pairingFlowState: FlowState = null;
  public availableNetworks: Array<WifiEntry> = null;
  public currentFirmware: string = null;
  public availableFirmware: string = null;

  // ---- Methods -----------------------------------------------------------


  // ==== PRIVATE ===========================================================
  // ---- Properties --------------------------------------------------------
  // ---- Methods -----------------------------------------------------------
}

export const LfAppState = new LfAppStateStore();
