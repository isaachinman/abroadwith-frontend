## Integration Environment
* To run any command on the root folder, you'll need to authenticate as **Jenkins** with the following command:
 `$ sudo -u jenkins`   
* The deployment is orchestrated by **Jenkins**, so you just need to push code into `dev` branch or whatever branch is defined in the Jenkins settings.
* Location of code workspace on Integration: `/var/lib/jenkins/jobs/Frontend/workspace`
* Integration Server: `ssh ec2-user@35.157.15.140`
* Jenkins URL: [ci.abroadwith.com](https://ci.abroadwith.com)

## Production Environment
* The main application is running on **nero server**: `ssh ec2-user@35.157.19.103`
* Merge your branch into master 
* Make sure the translation's repository is up to date with your changes
* Run `npm run deploy` and voilà
