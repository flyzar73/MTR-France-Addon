package fr.mtrfranceaddon;

import fr.mtrfranceaddon.registry.MTRFranceAddonRegistryClient;
import net.fabricmc.api.ClientModInitializer;

public class MTRFranceAddonClient implements ClientModInitializer {

    @Override
    public void onInitializeClient() {
        MTRFranceAddonRegistryClient.register();
    }
}
