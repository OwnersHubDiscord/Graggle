const BetterClient = require("../extensions/BetterClient");

class EventHandler {
	/**
	 *
	 * @param {BetterClient} client Our client.
	 * @param {string} name The name of our event handler.
	 * @param {Object} options Our options.
	 * @param {string?} options.event Our event name.
	 */
	constructor(client, name, options = {}) {
		this.name = name;
		this.client = client;
		this.event = options.event || name;
		this._listener = this._run.bind(this);
	}

	async _run(...args) {
		try {
			await this.run(...args);
		} catch (error) {
			this.client.logger.error(error, ...args);
			this.client.logger.sentry.captureWithExtras(error, {
				arguments: JSON.stringify(...args, null, 4)
			});
		}
	}

	listen() {
		this.client.on(this.event, this._listener);
	}

	removeListener() {
		this.client.off(this.event, this._listener);
	}
}

module.exports = EventHandler;
