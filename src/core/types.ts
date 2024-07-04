export interface Config {
	support_server: string
	api_token: string
	command_logger: {
		enabled: boolean
		webhook: string
	}
}

export interface APIResponse {
	status?: 'success' | 'error'
	message?: string
	result?: string
	took?: string
}

export interface TryAgainData {
	link: string
}
