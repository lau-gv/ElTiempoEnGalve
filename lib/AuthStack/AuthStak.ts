import { Stack, StackProps } from "aws-cdk-lib";
import { Construct } from "constructs";
import { AuthUser } from "./AuthUser";
import { UserPool } from "aws-cdk-lib/aws-cognito";


export class AuthStack extends Stack {
    public userPool : UserPool

    constructor(scope: Construct, id: string, props?: StackProps) {
        super(scope, id, props);

        const authUser = new AuthUser(this, "AuthUser");
        this.userPool = authUser.userPool;
    }
}