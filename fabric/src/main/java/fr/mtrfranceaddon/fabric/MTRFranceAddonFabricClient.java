package fr.mtrfranceaddon.fabric;

import fr.mtrfranceaddon.mod.common.Init;
import net.fabricmc.api.ClientModInitializer;

public class MTRFranceAddonFabricClient implements ClientModInitializer {

    @Override
    public void onInitializeClient() {
        Init.initClient();
    }

}
