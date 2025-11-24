class BaseController {
	/**
	 * @param {import('express').Response} [res]
	 * @param {*} [data]
	 * @param {number} [statusCode]
	 */
	success(res, data, statusCode = 200) {
		return res.status(statusCode).json({
			// used to be encapsulated in "data" object but oh well
			// https://cdn.discordapp.com/attachments/853813746426445874/1437015763721388113/image.png?ex=69130638&is=6911b4b8&hm=295e96e5bb63aeb2794577fd748e3526b812ec2d3b6c347c45654e12ccb33302
			...data
		});
	}

	/**
	 * @param {import('express').Response} [res]
	 * @param {string} [message]
	 * @param {number} [statusCode]
	 */
	error(res, message, statusCode = 400) {
		return res.status(statusCode).json({
			error: message
		});
	}

	/**
	 * @param {import('express').Response} [res]
	 * @param {*} [data]
	 */
	created(res, data) {
		return this.success(res, data, 201);
	}

	/**
	 * @param {import('express').Response} [res]
	 */
	noContent(res) {
		return res.status(204).send();
	}

	/**
	 * @param {import('express').Response} [res]
	 * @param {string} [message]
	 */
	notFound(res, message = "Not Found") {
		return this.error(res, message, 404);
	}

	/**
	 * @param {import('express').Response} [res]
	 * @param {string} message
	 */
	serverError(res, message = "Internal Server Error") {
		return this.error(res, message, 500);
	}
}

export default BaseController;
