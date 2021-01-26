
export interface RpcResponse {
  error?: {
    code: number,
    data: {
      error: string,
      message: string
    },
    message: string,
  },
  result?: any,
  id: string,
  jsonrpc: string,
}
