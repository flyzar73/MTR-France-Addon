package fr.mtrfranceaddon.registry;

import fr.mtrfranceaddon.Constants;
import org.mtr.mapping.holder.RenderLayer;
import org.mtr.mapping.registry.BlockRegistryObject;
import org.mtr.mapping.registry.RegistryClient;

public class MTRFranceAddonRegistryClient {

    public static final RegistryClient REGISTRY_CLIENT = new RegistryClient(MTRFranceAddonRegistry.REGISTRY);

    public static void register() {
        // Here you call methods to register renders.
        // Example: ModBlockRenderers.register();
        Events.registerClient();
        BlockEntityRenderers.registerClient();
        Networking.registerClient();

        // Initialize the client registry
        REGISTRY_CLIENT.init();
    }

    public static void setupPacketClient() {
        REGISTRY_CLIENT.setupPackets(Constants.id("packet"));
    }

    /**
     * Define the render type for one or multiple blocks.
     * Essential for transparent blocks or with cut parts.
     * @param renderLayer The render type (ex: RenderLayer.getCutout())
     * @param blocks Concerned blocks.
     */
    public static void registerBlockRenderType(RenderLayer renderLayer, BlockRegistryObject... blocks) {
        for (BlockRegistryObject block : blocks) {
            REGISTRY_CLIENT.registerBlockRenderType(renderLayer, block);
        }
    }

}
