package fr.mtrfranceaddon.data;

import org.mtr.mapping.holder.MapColor;

import java.util.Arrays;
import java.util.List;

public final class CustomRailData {

    public static class RailInfo {
        public final String name;
        public final int speed;
        public final MapColor color;

        public RailInfo(String name, int speed, MapColor color) {
            this.name = name;
            this.speed = speed;
            this.color = color;
        }
    }

    public static final List<RailInfo> CUSTOM_RAILS = Arrays.asList(
            new RailInfo("RAIL_30", 30, MapColor.getStoneGrayMapped()),
            new RailInfo("RAIL_50", 50, MapColor.getStoneGrayMapped()),
            new RailInfo("RAIL_70", 70, MapColor.getStoneGrayMapped()),
            new RailInfo("RAIL_90", 90, MapColor.getStoneGrayMapped()),
            new RailInfo("RAIL_110", 110, MapColor.getStoneGrayMapped()),
            new RailInfo("RAIL_130", 130, MapColor.getStoneGrayMapped()),
            new RailInfo("RAIL_150", 150, MapColor.getStoneGrayMapped()),
            new RailInfo("RAIL_220", 220, MapColor.getStoneGrayMapped()),
            new RailInfo("RAIL_270", 270, MapColor.getStoneGrayMapped()),
            new RailInfo("RAIL_320", 320, MapColor.getStoneGrayMapped()),
            new RailInfo("RAIL_350", 350, MapColor.getStoneGrayMapped())
    );

}
