// ==== Library Imports =======================================================
class LfAppStateStore {
  // ==== PUBLIC ============================================================
  // ---- Construction ------------------------------------------------------
  constructor(
  // Dependency Injections
  ) {
    // ---- Methods -----------------------------------------------------------
    // ==== PROTECTED =========================================================
    // ---- Properties --------------------------------------------------------
    // ---- Methods -----------------------------------------------------------
    // ==== PRIVATE ===========================================================
    // ---- Properties --------------------------------------------------------
    // Getter/Setter backing variables and defaults
    this._selectedNetwork = null;
    this._submittedPassword = null;
    this._pairingFlowState = null;
    // console.group("LfAppState");
    try {
    }
    catch (e) {
      // console.error(e);
    }
    finally {
      // console.groupEnd();
    }
  }
  // ---- Properties --------------------------------------------------------
  // Getters/Setters
  get pairingFlowState() { return this._pairingFlowState; }
  set pairingFlowState(newValue) { this._pairingFlowState = newValue; }
  get selectedNetwork() { return this._selectedNetwork; }
  set selectedNetwork(newValue) { this._selectedNetwork = newValue; }
  get submittedPassword() { return this._submittedPassword; }
  set submittedPassword(newValue) { this._submittedPassword = newValue; }
}
const LfAppState = new LfAppStateStore();

export { LfAppState as L };
