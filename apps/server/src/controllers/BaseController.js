class BaseController {
	/**
	 * @param {import('express').Response} res
	 * @param {*} data
	 * @param {number} statusCode
	 */
	success(res, data, statusCode = 200) {
		return res.status(statusCode).json({
			...data
		});
	}

	/**
	 * @param {import('express').Response} res
	 * @param {string} message
	 * @param {number} statusCode
	 */
	error(res, message, statusCode = 400) {
		return res.status(statusCode).json({
			error: message
		});
	}

	/**
	 * @param {import('express').Response} res
	 * @param {*} data
	 */
	created(res, data) {
		return this.success(res, data, 201);
	}

	/**
	 * @param {import('express').Response} res
	 */
	noContent(res) {
		return res.status(204).send();
	}

	/**
	 * @param {import('express').Response} res
	 * @param {string} message
	 */
	notFound(res, message = "Not Found") {
		return this.error(res, message, 404);
	}

	/**
	 * @param {import('express').Response} res
	 * @param {string} message
	 */
	serverError(res, message = "Internal Server Error") {
		return this.error(res, message, 500);
	}
}

export default BaseController;
