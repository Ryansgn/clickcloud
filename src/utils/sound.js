let muted = localStorage.getItem("rpg:muted") === "true";

export function isMuted() {
  return muted;
}

export function toggleMute() {
  muted = !muted;
  localStorage.setItem("rpg:muted", String(muted));
}

export function playSound(type) {
  if (muted) return;
  let ctx = new (window.AudioContext || window.webkitAudioContext)();
  let o = ctx.createOscillator();
  let g = ctx.createGain();
  o.connect(g);
  g.connect(ctx.destination);
  o.type = "square";

  if (type === "coin") {
    o.frequency.value = 880;
  } else if (type === "xp") {
    o.frequency.value = 660;
  } else if (type === "badge") {
    o.frequency.value = 1046;
  } else {
    o.frequency.value = 440;
  }
  g.gain.setValueAtTime(0.1, ctx.currentTime);
  o.start();
  o.stop(ctx.currentTime + 0.2);
}
