# app-animalpics
This is an app built with Javascript that pings different APIs to fetch animal pictures based on user choice.
Baisc UI built with HTML

#UI Funtionality:
Dropdown:
Select from three different animals (cat, dog, bear)

Counter:
Select the amount of pictures you'd like to save to your database

3 buttons:
Save Picture 
Retrieve Last Picture
Display all saved pictures


#To run the APP
First, make sure Docker is running on your system. You can verify with:

Terminal(mac)/Powershell(windows):
docker --version
docker-compose --version

If Docker is installed run the following command:
docker-compose up --build

Access App: 
http://localhost:3000


If Docker Desktop is not installed:

MAC OSX:
Install Homebrew (if not already installed):
_/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"_

Install Docker Desktop
brew install --cask docker

Verify:
_docker --version_

Now you can access app url above.


WINDOWS:
#Download Docker Desktop Installer:

Visit https://www.docker.com/products/docker-desktop
Click "Download for Windows"

#System Requirements:

Windows 10 64-bit: Pro, Enterprise, or Education (Build 15063 or later)
WSL 2 feature must be enabled
BIOS-level hardware virtualization enabled

# Run in PowerShell as Administrator
_dism.exe /online /enable-feature /featurename:Microsoft-Windows-Subsystem-Linux /all /norestart_
_dism.exe /online /enable-feature /featurename:VirtualMachinePlatform /all /norestart_

#Restart your computer
Install WSL 2 Kernel update:

#Download and install the Linux kernel update package from Microsoft

Set WSL 2 as default:
_wsl --set-default-version 2_

#Run the Docker Desktop Installer (Docker Desktop Installer.exe)
Verify installation:
_docker --version_

Now you can access app url above.

#Resources and RESTAPIs used:

MongoDB for embedded DB:
http://localhost:27017
URI: mongodb://mongodb:27017/animal-pictures

APIs used:
http://localhost:port/last-picture/cat
http://localhost:port/last-picture/dog
http://localhost:port/last-picture/bear

To save the pictures
POST
/save-pictures

To retrieve the pictures
GET
/last-picture/:animalType
/all-pictures/:animalType
