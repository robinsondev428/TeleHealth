import { Next } from 'koa'
import { AppContext } from '../types'

export async function resetPassword(ctx: AppContext, next: Next) {
	const { email } = ctx.request.body
	if (!ctx.state.user) {
		ctx.body = {
			message: 'User with email does not exist',
		}

		ctx.status = 400
	}

	if (ctx.state.user.email === email) {
		const resetLink = await ctx.services.firebase
			.auth()
			.generatePasswordResetLink(email)

		ctx.state.passwordResetLink = resetLink

		ctx.body = {
			message: 'Password Reset Link Generated',
		}

		ctx.status = 200
	}
}
