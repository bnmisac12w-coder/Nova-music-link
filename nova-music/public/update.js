// 1. style.css'e player gizleme ve animasyon ekleyelim
cat << 'CSS' >> ~/nova-music/public/style.css
.player {
  transform: translateY(120%);
  transition: transform 0.3s ease;
}
.player.player-visible {
  transform: translateY(0);
}
CSS

