gulp &&
gulp deploy &&
ssh -i pbox-dev.pem ubuntu@ec2-35-156-247-206.eu-central-1.compute.amazonaws.com "rm -rf ~/apps/pbb; mkdir ~/apps/pbb" &&
scp -r -i pbox-dev.pem deploy/* ubuntu@ec2-35-156-247-206.eu-central-1.compute.amazonaws.com:apps/pbb &&
ssh -i pbox-dev.pem ubuntu@ec2-35-156-247-206.eu-central-1.compute.amazonaws.com "cd ~/apps/pbb; npm install; forever restartall"