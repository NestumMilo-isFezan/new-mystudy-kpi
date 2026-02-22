import ky from "ky";

const AUTH_COOKIE_PREFIX = "AUTH_TOKEN=";

const apiKy = ky.create({
	hooks: {
		beforeRequest: [
			(request) => {
				const cookieHeader = request.headers.get("Cookie");
				if (!cookieHeader) {
					return;
				}

				if (
					cookieHeader.includes(`${AUTH_COOKIE_PREFIX}undefined`) ||
					cookieHeader.includes(`${AUTH_COOKIE_PREFIX}null`) ||
					cookieHeader.trim() === AUTH_COOKIE_PREFIX
				) {
					request.headers.delete("Cookie");
				}
			},
		],
	},
});

export default apiKy;
