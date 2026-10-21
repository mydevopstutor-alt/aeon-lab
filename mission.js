const S={
start:{n:"Rain on chrome. You're jacked into the Docker Dock, where every cargo pod is a container. First, prove your rig can talk to the Docker daemon.",
 t:"Run the test image. Docker pulls it if it isn't already local, starts a container, and prints a greeting:",c:"docker version\ndocker run hello-world",
 o:[["It printed 'Hello from Docker!'","web"],["It said 'permission denied ... docker.sock'","perm"]]},
perm:{n:"The dock gate rejects you. Your user isn't allowed to reach the daemon socket.",t:"On Linux, add yourself to the docker group, then log out and back in (or use sudo). On Docker Desktop, make sure the app is running.",
 c:"sudo usermod -aG docker $USER\n# log out and back in, then:\ndocker run hello-world",o:[["Fixed it. Try again","web"]],bad:1},
web:{n:"You're in. A guard drone drops a job on you: run the dock's web beacon, an nginx web server, in the background and reach it from your browser on port 8080.",
 t:"Which command do you run?",o:[["docker run -d --name beacon -p 8080:80 nginx","ps"],["docker run -d --name beacon -p 80:8080 nginx","portbad"]]},
portbad:{bad:1,n:"Sirens. The beacon is up, but nothing answers on localhost:8080.",t:"The -p flag is HOST:CONTAINER. nginx listens on port 80 inside the container, so -p 80:8080 forwarded host port 80 to container port 8080, where nothing is listening. Remove it and run the correct mapping:",
 c:"docker rm -f beacon\ndocker run -d --name beacon -p 8080:80 nginx",o:[["Rerun with the correct mapping","ps"]]},
ps:{n:"The beacon hums. Open http://localhost:8080 and you'll see 'Welcome to nginx!'. Now confirm it's on the manifest.",t:"List the running containers. Look for the PORTS column: 0.0.0.0:8080->80/tcp.",c:"docker ps",
 o:[["beacon is listed","logs"],["It's empty, but docker ps -a shows beacon as Exited","exited"]]},
exited:{bad:1,n:"The pod went dark. A container stops when its main process exits.",t:"Read its logs to find out why. Then remove it and start it again (often a port is already in use):",c:"docker logs beacon\ndocker rm -f beacon\ndocker run -d --name beacon -p 8080:80 nginx",o:[["Running now","logs"]]},
logs:{n:"Your browser hits were recorded somewhere. The narrator whispers: logs never lie.",t:"Read the container's output (nginx sends its access log to stdout). Add -f to follow it live and Ctrl+C to stop:",c:"docker logs beacon\ndocker logs -f beacon",
 o:[["I see GET / requests. Now get inside","exec"],["Run 'docker logs nginx' instead","logsbad"]]},
logsbad:{bad:1,n:"'Error: No such container: nginx'.",t:"docker logs takes the container's name or ID, not the image name. Our container is called beacon.",c:"docker logs beacon",o:[["Got it","exec"]]},
exec:{n:"Time to breach. Open a shell inside the running pod.",t:"exec runs a new process in a running container. -it gives you an interactive terminal. The nginx image includes sh:",
 c:"docker exec -it beacon sh\n# inside the container:\ncat /usr/share/nginx/html/index.html\nexit",o:[["I'm in and out. Forge our own image","build"],["Try 'docker run -it beacon sh'","execbad"]]},
execbad:{bad:1,n:"'Unable to find image beacon:latest'.",t:"docker run starts a NEW container from an IMAGE. To get into an EXISTING container, use docker exec:",c:"docker exec -it beacon sh",o:[["Use exec instead","build"]]},
build:{n:"Final job: plant the Aeon Industries flag. Build your own image.",t:"In an empty folder, create these two files, then build the image. The -t flag tags it, and the . sends the current folder as the build context:",
 c:"mkdir aeon-flag && cd aeon-flag\necho '<h1>Aeon Industries was here</h1>' > index.html\ncat > Dockerfile <<'DF'\nFROM nginx:alpine\nCOPY index.html /usr/share/nginx/html/index.html\nDF\ndocker build -t aeon-flag .",
 o:[["Built. Run it on 8081","win"],["Run it on 8080 too","clash"]]},
clash:{bad:1,n:"'Bind for 0.0.0.0:8080 failed: port is already allocated'.",t:"Two containers can't share one host port. beacon already has 8080, so pick a different host port:",c:"docker run -d --name flag -p 8081:80 aeon-flag",o:[["Use 8081","win"]]},
win:{n:"http://localhost:8081 glows with your flag. The Dock is yours, operator.",t:"Run it (skip this if you already ran it), check it, then clean up:",c:"docker run -d --name flag -p 8081:80 aeon-flag\ndocker ps\ndocker rm -f beacon flag",o:[["Play again","start"]]}};
const el=document.getElementById('scene');
function esc(s){return s.replace(/[&<>]/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;'}[m]))}
function go(k){const s=S[k];const img=k==='win'?'win':s.bad?'alarm':'start';el.innerHTML=`<img src="lilith/scenes/${img}.jpg" alt="" style="width:100%;border-radius:10px;border:1px solid var(--teal)">${k==='start'?'<p class="narr">Prologue: <a href="liu/">The Docker Dock Goes Dark</a> by Liu</p>':''}${s.bad?'<p class="bad">✖ Wrong turn</p>':''}<p class="narr">NARRATOR: ${s.n}</p><p>${s.t}</p>${s.c?`<pre><button class="copy">copy</button><code>${esc(s.c)}</code></pre>`:''}<div class="choices"></div>`;
 const b=el.querySelector('.copy');if(b)b.onclick=()=>{navigator.clipboard.writeText(s.c);b.textContent='copied'};
 const ch=el.querySelector('.choices');s.o.forEach(([l,to])=>{const x=document.createElement('button');x.textContent='› '+l;x.onclick=()=>go(to);ch.appendChild(x)});}
go('start');
const a=document.getElementById('bgm'),m=document.getElementById('music');
m.onclick=()=>{if(a.paused){a.play();m.textContent='♪ Music: on'}else{a.pause();m.textContent='♪ Music: off'}};
