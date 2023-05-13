# El tiempo en Galve API CDK TypeScript project

Esta es la API del proyecto, está realizada con AWS CDK y typescript

**Nota importante:**  Este proyecto NO FUNCIONA en la región de españa (eu-south-2) a fecha de 13/05/2023, porque se utilizan Canalizaciones, pipes, de EventBridge, servicio 
no disponible en esta región todavía. Se recomienda entonces utilizar la región de París (eu-west-3) 

## Requerimientos
Para poder replicar el proyecto, es necesario:
* `Node js`   Se ha utilizado la versión v18.13.0
* `Tener AWS CDK instalado`     Se ha utilizado la version 2.78.0 (build 8e95c37) https://docs.aws.amazon.com/cdk/v2/guide/getting_started.html
* `Tener una cuenta de AWS e instalar AWS CLI y configurar una cuenta para poder utilizarlo`   https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html
* `Tener AWS CDK instalado`     Se ha utilizado la version 2.78.0 (build 8e95c37) (`npm install -g aws-cdk`)
* `esbuild`     Es la librería utilizada para transpilar de typescript a javascript. 

## Instalar las dependencias:
Una vez descargado / clonado el proyecto:

* `npm install`

## Estructura del proyecto:
* `bin`     Contiene el código de "entrada" de la aplicación. La declaración de la app, y los stacks asociados.
* `lib`     Contiene los stacks y constructores de AWS CDK. Se agrupan por servicio, a excepción de la base de datos, que se declara en su propio stack.
* `src`     Contiene el código del proyecto. Se agrupa por servicio, en la carpeta common se encuentra el código común de los distintos servicios de la API.
            Aquí también encontramos el código que será utilizado en las lambdas.

* `package.json`    Contiene las dependencias del proyecto
* `cdk.json`        Se trata del fichero que configura CDK dentro de nuestro proyecto CDK. Destaca que es aquí donde se declara la entrada de nuestro programa:
                    "app": "npx ts-node --prefer-ts-exts bin/el_tiempo_en_galve.ts",




## Comandos CDK.
* `cdk deploy` Este comando nos desplegará una plantilla de AWS CloudFormation y toda la infraestrctura declarada en el proyecto
* `cdk synth`  Creará de forma local la plantilla de CloudFormation. Nos permité comprobar que a priori todo está bien ^^
* `cdk destroy` Destruye el proyeto
* `cdk bootstrap`   Antes de poder desplegar infraestructura usando CDK en AWS, debemos "bootstrear" el entorno. Esto en concreto despliega el CDK toolkit en AWS    CloudFormation y prepara todo para que podamos utilizar CDK.


**Nota importante:**  Las tablas de dynamo no se borran automáticamente al destruir el proyecto. Es necesario borrarlas a mano. Igualmente, Se vuelve conveniente borrar los registros de CloudWatch y verificar que no se ha quedado ninguna alarma configurada. Hay algunos recursos que no se eliminan de forma automática al destruir un proyecto de CloudFormation, suelen ser los recursos con estado, como podrías ser S3 o Dynamo.

## Servicios de AWS utilizados
* `CloudWatch`
* `Cloudformation`
* `IAM`
* `CloudFront`
* `API Gateway`
* `Lambda`
* `StepFunctions`
* `Simple Queue Service (SQS)`
* `Dynamod DB`
* `EventBridge`


## El tiempo en Galve API CDK TypeScript project
The `cdk.json` file tells the CDK Toolkit how to execute your app.

## Useful commands

* `npm run build`   compile typescript to js
* `npm run watch`   watch for changes and compile
* `npm run test`    perform the jest unit tests
* `cdk deploy`      deploy this stack to your default AWS account/region
* `cdk diff`        compare deployed stack with current state
* `cdk synth`       emits the synthesized CloudFormation template
