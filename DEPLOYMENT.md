# Admin dashboard deployment

The production dashboard runs as a Next.js service on the existing server:

- Checkout/runtime directory: `/opt/smart-mobility/frontend`
- systemd unit: `smart-mobility-admin.service`
- Local health URL: `http://127.0.0.1:3000/sys-admin/users/audit`
- Public site: `https://smartmobilityroadcare.com/`

## Deploy directly from a PC

Requirements: Node.js 22, npm, `rsync`, and verified SSH access. The SSH
account must be able to update the dashboard files and restart the service.
From the repository root:

```sh
export DEPLOY_HOST=201.79.45.60
export DEPLOY_USER=root
bash ./scripts/deploy-production.sh
```

The script builds locally, copies the source to the server, installs the locked
dependencies, builds on the server, restarts the service, and checks its
response. It preserves `.env*`, `.next`, `node_modules`, `auth.db`, and local
dashboard data on the server. It does not deploy secrets from the PC.

## Deploy through GitHub

Pushing to `main` runs the production deployment workflow. It checks out that
commit on a self-hosted runner installed on the production server and uses the
same deployment script. No server SSH key or deployment credential is stored
in GitHub. The live folder has runtime state and previously had locally applied
changes, so a raw `git pull` there is not a reliable deployment method.

Register a repository-level runner in **Settings → Actions → Runners** and
install its service on the production host. Repeat registration for each
repository using the workflow. The runner needs Linux x64 labels including
`smr-production`, Node.js 22, npm, and permission to update the dashboard and
restart its systemd service. Use a dedicated runner identity where practical;
the systemd restart and deployment access are production privileges. Protect
`main`, configure the `production` environment to allow only `main`, restrict
runner and workflow access, and do not run untrusted fork or pull-request
workflows on this host. Enter the short-lived runner-registration token on the
host only; do not store it in the repository.

You can also run the workflow manually under
**Actions → Deploy admin dashboard → Run workflow**; it is restricted to
`main`.

## Runtime-state protection and rollback

The server's `.env`, `.env.production`, `auth.db`, and dashboard data are
preserved. The deployment keeps the existing `.next` build as a rollback copy
until the new build succeeds; on build failure, it restores that build and
leaves the running service alone.

For rollback, redeploy a previously successful commit from Actions or check out
that commit on a PC and rerun the script. Do not delete the live `auth.db` or
environment files during cleanup. The direct PC path uses SSH, keeping the
PC's private key on the PC rather than in GitHub.
