import { Stack, StackProps } from "aws-cdk-lib";
import { Construct } from "constructs";
import { AuthUser } from "./AuthUser";

  export class UserServiceStack extends Stack {
    constructor(scope: Construct, id: string, props?: StackProps) {
        super(scope, id, props);

        const authUser = new AuthUser(this, "AuthUser");
    }
}