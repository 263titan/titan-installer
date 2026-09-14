cask "titan-printsync" do
  version "0.1.0"
  sha256 :no_check
  url "https://github.com/263titan/titan-installer/releases/latest/download/Titan-Production-Suite-x.x.x.dmg"
  name "Titan PrintSync"
  desc "Print production suite for plotters and cutters"
  homepage "https://github.com/263titan/titan-installer"
  auto_updates true
  depends_on macos: ">= :big_sur"
end
