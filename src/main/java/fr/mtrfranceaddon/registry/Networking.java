package fr.mtrfranceaddon.registry;

import fr.mtrfranceaddon.MTRFranceAddon;

public class Networking {

    public static void register() {
        MTRFranceAddon.LOGGER.info("Registering Network Packets");
    }

    public static void registerClient() {
        MTRFranceAddonRegistryClient.setupPacketClient();
    }

}
