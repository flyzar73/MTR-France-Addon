package fr.mtrfranceaddon.fabric;

import fr.mtrfranceaddon.mod.common.Init;
import net.fabricmc.api.ModInitializer;

public class MTRFranceAddonFabric implements ModInitializer {

    @Override
    public void onInitialize() {
        Init.init();
    }

}