package fr.mtrfranceaddon.mod.common.registry;

import fr.mtrfranceaddon.mod.common.Init;
import org.mtr.mapping.registry.PacketHandler;
import org.mtr.mapping.tool.PacketBufferReceiver;

import java.util.function.Function;

public class ModNetworking {

    public static void register() {
        Init.LOGGER.info("Registering Network Packets");
    }

    public static void registerClient() {
        MTRFranceAddonRegistryClient.setupPacketClient();
    }

}
