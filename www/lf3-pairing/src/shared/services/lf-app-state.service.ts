// ==== Library Imports =======================================================

// ==== App Imports ===========================================================
import { WifiEntry } from "../interfaces/wifi-entry.interface";

export class LfAppState {

  // ==== PUBLIC ============================================================
  // ---- Construction ------------------------------------------------------

  constructor(
    // Dependency Injection
  ) {
    console.group("LfAppState");
    try {
    }
    catch (e) {
      console.exception(e);
    }
    finally {
      console.groupEnd();
    }
  }

  // ---- Properties --------------------------------------------------------

  // Getters/Setters
  public get selectedNetwork(): WifiEntry { return this._selectedNetwork; }
  public set selectedNetwork(newValue: WifiEntry) { this._selectedNetwork = newValue; }


  // ---- Methods -----------------------------------------------------------

  // ==== PROTECTED =========================================================
  // ---- Properties --------------------------------------------------------
  // ---- Methods -----------------------------------------------------------

  // ==== PRIVATE ===========================================================
  // ---- Properties --------------------------------------------------------

  // Getter/Setter backing variables and defaults
  private _selectedNetwork: WifiEntry = null;

  // ---- Methods -----------------------------------------------------------
}
