
import { Construct } from "constructs"
import { Chain, Map, StateMachine } from 'aws-cdk-lib/aws-stepfunctions';
import { Queue } from "aws-cdk-lib/aws-sqs";
import { Effect, PolicyStatement, Role, ServicePrincipal } from "aws-cdk-lib/aws-iam";
import { CfnPipe } from "aws-cdk-lib/aws-pipes";
import { UserPool, UserPoolClient } from "aws-cdk-lib/aws-cognito";
import { CfnOutput } from "aws-cdk-lib";



//Este constructor colabora con el StackDeBase de datos. Necesita conocerlo en tanto que 
//se van a acceder a estas dos tablas.

export class AuthUser extends Construct {

    public userPool : UserPool
    private userPoolclient: UserPoolClient;

    constructor(scope: Construct, id: string){
        super(scope, id);
        this.createUserPool();
        this.createUserPoolclient();
    }

    private createUserPool(){
        this.userPool = new UserPool(this, 'TiempoUserPool', {
            selfSignUpEnabled: true,
            signInAliases:{
                username: true,
                email: true
            }
        });

        new CfnOutput(this, 'UserUserPoolId', {
            value: this.userPool.userPoolId
        });
    };

    //Un userPool no puede existir sin un cliente!
    private createUserPoolclient(){
        this.userPoolclient = this.userPool.addClient('TiempoUserPoolClient', {
            //Especificamos los flujos de autenticación que estarán habilitados para este cliente
            authFlows : {
                //Permite a los administradores autenticarse utilizando un nombre de usuario y contraseña
                adminUserPassword: true,
                //Permite la autenticación personalizada a través de un flujo de autenticación personalizado
                custom: true,
                //Permite que los usuarios finales autentiquen con su nombre de usuario y contraseña
                userPassword: true,
                //permite que los usuarios finales autentiques utilizando SRP (protocolo de rememoracion segura)/*.
                userSrp: true
            }
        })

        new CfnOutput(this, 'TiempoUserPoolClientId', {
            value: this.userPoolclient.userPoolClientId
        });
    };
}