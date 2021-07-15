pipeline {
  agent {
    node {
      label 'helios-ui-testing'
    }

  }
  triggers {
    // Check for new change every 5 minutes 
    pollSCM('H/5 * * * *')
  }
  options {
    // Keep maximum 10 archived artifacts
    buildDiscarder(logRotator(numToKeepStr: '50', artifactNumToKeepStr: '50'))
    // No simultaneous builds
    disableConcurrentBuilds()
    // Timeout after x minutes
    timeout(time: 1, unit: "DAYS")
    // Add timestamp to output
    timestamps()
  }
  stages {
    stage('Clean up') {
      steps {
        sh 'git clean -nd'
      }
    }
    stage('Get latest Helios') {
      steps {
        echo 'Artifact Copied....'
        copyArtifacts(projectName: 'Helios-Centos/development');
      }
    }

    stage('Extract Helios') {
      steps {
        sh 'mkdir artifacts/helios_latest'
        sh 'tar -xzvf artifacts/*.tar.gz -C artifacts/helios_latest --strip-components=1'
      }
    }

    stage('Install Helios') {
      steps {
        sh 'cd artifacts/helios_latest && sudo ./install.sh -y '
      }
    }

    stage('Running UI Tests') {
      steps {

        nvm(nvmInstallURL: 'https://raw.githubusercontent.com/creationix/nvm/v0.38.0/install.sh', 
             nvmIoJsOrgMirror: 'https://iojs.org/dist',
             nvmNodeJsOrgMirror: 'https://nodejs.org/dist', 
             version: '10.24.1') {
                    echo "Running Cypress Tests...."
                    sh ' ./run-cypress.sh -c video=true'
              }
        
      }
    }
    
  }
  post {
    always {
        junit 'results/cypress-report.xml'
    }
    failure {
        archiveArtifacts artifacts: 'cypress/screenshots/**/*.*, cypress/videos/**/*',
                            excludes: 'cypress/screenshots/**/temp*.*',
                            allowEmptyArchive: true,
                            fingerprint: false
    }

}

}
