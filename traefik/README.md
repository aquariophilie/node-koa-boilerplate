# HOWTO Configure Traefik Proxy for rfid-backend

Logged as `gpmacario@HW2457`

```bash
ssh -L 6443:localhost:6443 \
    -J gmacario@dory.gmacario.it \
    -i .ssh/gmacario-gmail-com \
    azureuser@arneis-vm01.gmacario.it
```

Logged as `gmacario@HW2457`

```bash
export KUBECONFIG=$HOME/.kube/arneis.kubeconfig

kubectl cluster-info
kubectl get nodes
```

Make Traefik Dashboard accessible through port forward

```bash
kubectl -n kube-system \
    port-forward \
    deployment/traefik \
    9000:9000
```

The Traefik Dashboard should now be available at
<http://localhost:9000/dashboard/>

```bash
export CLUSTERIP=20.124.234.219
```

NOTE: Configured DNS `gmacario.it`:

```text
rfid-backend CNAME $CLUSTERIP
```

```bash
kubectl create namespace rfid
kubectl config set-context rfid \
    --cluster=arneis \
    --user=default \
    --namespace=rfid
kubectl config use-context rfid

helm install my-release chart/koa-mongo-k8s

kubectl expose deploy/my-release-koajs-k8s -n rfid --port=4000 --target-port=4000 --name=rfid-backend

# Patch manifest with actual CLUSTERIP
# sed -i "s/10\.68\.0\.70/${CLUSTERIP}/" traefik/ingressroute.yaml

kubectl apply -f traefik/ingressroute.yaml
```

Test

```bash
curl -v http://rfid-backend.gmacario.it/api/status
```

Result:

```text
gmacario@HW2457:/mnt/c/Users/gpmacario/github/aquariophilie/node-koa-boilerplate$ curl -v http://rfid-backend.gmacario.it/api/status
*   Trying 20.124.234.219:80...
* TCP_NODELAY set
* Connected to rfid-backend.gmacario.it (20.124.234.219) port 80 (#0)
> GET /api/status HTTP/1.1
> Host: rfid-backend.gmacario.it
> User-Agent: curl/7.68.0
> Accept: */*
>
* Mark bundle as not supporting multiuse
< HTTP/1.1 200 OK
< Content-Length: 40
< Content-Type: application/json; charset=utf-8
< Date: Tue, 14 Jun 2022 09:51:10 GMT
< Vary: Origin
<
* Connection #0 to host rfid-backend.gmacario.it left intact
{"status":"online","appVersion":"0.1.0"}gmacario@HW2457:/mnt/c/Users/gpmacario/github/aquariophilie/node-koa-boilerplate$
```

TODO

<!-- EOF -->