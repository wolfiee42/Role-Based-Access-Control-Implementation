import { Policy, PolicyContext, PolicyResult } from "../policy";

export class PurchasePolicy extends Policy {
  constructor() {
    super("PurchasePolicy", "Check if the user can purchase a product");
  }

  can(context: PolicyContext): Promise<PolicyResult> {
    const { userId } = context;
    const blockedUsers = [123, 456, 789];

    if (blockedUsers.includes(userId as number)) {
      return Promise.resolve(
        this.denied("User is not allowed to purchase a product")
      );
    }
    return Promise.resolve(this.allowed());
  }
}
