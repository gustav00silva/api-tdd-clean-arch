import { HttpResponse } from "../helpers/httpReponse.js";
import { MissingParamError } from "../../utils/errors/missing-params-error.js";
import { InvalidParamError } from '../../utils/errors/invalid-params-error.js'

export class LoginRouter {
  constructor({ authUseCase, emailValidator } = {}) {
    this.authUseCase = authUseCase;
    this.emailValidator = emailValidator
  }

  async route(httpRequest) {
    try {
      if (
        !httpRequest ||
        !httpRequest.body ||
        !this.authUseCase ||
        !this.authUseCase.auth
      ) {
        return HttpResponse.InternalError();
      }
      const { email, password } = httpRequest.body;
      if (!email) {
        return HttpResponse.badRequest(new MissingParamError('email'));
      }
      if (!this.emailValidator.isValid(email)) {
        return HttpResponse.badRequest(new InvalidParamError('email'));
      }
      if (!password) {
        return HttpResponse.badRequest(new MissingParamError('password'));
      }

      const accessToken = await this.authUseCase.auth(email, password);
      console.log(accessToken)
      if (!accessToken) return HttpResponse.unauthorizeError();
      return HttpResponse.ok({ accessToken });
    } catch (error) {
      return HttpResponse.InternalError();
    }
  }
}
