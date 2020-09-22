// ==== Library Imports =======================================================

// ==== App Imports ===========================================================
import { WifiEntry } from "../interfaces/wifi-entry.interface";

class LfAppStateStore {

  // ==== PUBLIC ============================================================
  // ---- Construction ------------------------------------------------------

  constructor(
    // Dependency Injections
  ) {
    console.group("LfAppState");
    try {
    }
    catch (e) {
      console.error(e);
    }
    finally {
      console.groupEnd();
    }
  }

  // ---- Properties --------------------------------------------------------

  // Getters/Setters
  public get selectedNetwork(): WifiEntry { return this._selectedNetwork; }
  public set selectedNetwork(newValue: WifiEntry) { this._selectedNetwork = newValue; }
  public get submittedPassword(): string { return this._submittedPassword; }
  public set submittedPassword(newValue: string) {this._submittedPassword = newValue; }


  // ---- Methods -----------------------------------------------------------

  // ==== PROTECTED =========================================================
  // ---- Properties --------------------------------------------------------
  // ---- Methods -----------------------------------------------------------

  // ==== PRIVATE ===========================================================
  // ---- Properties --------------------------------------------------------

  // Getter/Setter backing variables and defaults
  private _selectedNetwork: WifiEntry = null;
  private _submittedPassword: string = null;

  // ---- Methods -----------------------------------------------------------
}

export const LfAppState = new LfAppStateStore();
