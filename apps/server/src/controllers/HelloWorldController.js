import BaseController from './BaseController.js';

class HelloWorldController extends BaseController {
	constructor() {
		super();

		this.hello = this.hello.bind(this);
	}

	/**
	 * @description Handles GET /hello requests
	 * @param {import('express').Request} req
	 * @param {import('express').Response} res
	 */
	hello(req, res) {
		return this.success(res, {
			message: "Hello, World!"
		});
	}
}

export default new HelloWorldController();
