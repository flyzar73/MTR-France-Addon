package fr.mtrfranceaddon;

import fr.mtrfranceaddon.registry.MTRFranceAddonRegistry;
import net.fabricmc.api.ModInitializer;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class MTRFranceAddon implements ModInitializer {

    public static final Logger LOGGER = LoggerFactory.getLogger(Constants.MOD_ID);

    @Override
    public void onInitialize() {
        LOGGER.info("Initializing {} v{}", Constants.MOD_NAME, Constants.MOD_VERSION);

        MTRFranceAddonRegistry.register();
    }
}